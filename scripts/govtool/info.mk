# pipeline information
pipeline_url := $(shell echo $${PIPELINE_URL:-})
ifeq ($(pipeline_url),)
  pipeline_info := _Deployed from local machine._
else
  pipeline_info := _Deployed from <$(pipeline_url)|GitHub>._
endif

deployment_log_file := /var/log/deployment.log

.PHONY: log-deployment
log-deployment:
	@:$(call check_defined, cardano_network)
	@:$(call check_defined, env)
	ssh $(ssh_url) 'echo "$(shell date +'%Y-%m-%d %H:%M:%S%z') INFO: $(branch) ($(commit)); cardano-node $(cardano_node_image_tag); cardano-dbsync $(cardano_db_sync_image_tag); backend $(backend_image_tag); frontend $(frontend_image_tag); $(pipeline_url)" >> $(deployment_log_file)'

.PHONY: info
info:
	@:$(call check_defined, cardano_network)
	@:$(call check_defined, env)
	@echo "+-----------"
	@echo "|  TIME      $(shell date +'%Y-%m-%d %H:%M:%S%z')"
	@echo "|  BRANCH    $(branch) [$(commit)]"
	@echo "|  ENV       $(env)"
	@echo "I  NETWORK   $(cardano_network)"
	@echo "N  BACKEND   $(repo_url)/backend:$(backend_image_tag)"
	@echo "F  FRONTEND  $(repo_url)/frontend:$(frontend_image_tag)"
	@echo "O  NODE      ghcr.io/intersectmbo/cardano-node:$(cardano_node_image_tag)"
	@echo "|  DBSYNC    ghcr.io/intersectmbo/cardano-db-sync:$(cardano_db_sync_image_tag)"
	@echo "|  SSH       $(ssh_url)"
	@echo "|  URL       https://$(docker_host)"
	@echo "+-----------"

.PHONY: notify
notify: info log-deployment
	@:$(call check_defined, cardano_network)
	@:$(call check_defined, env)
	$(curl) -X POST https://slack.com/api/chat.postMessage\
		-H "Authorization: Bearer $${GRAFANA_SLACK_OAUTH_TOKEN}" \
		-H "Content-Type: application/json; charset=utf-8" \
		--data "{ \"channel\":\"$${GRAFANA_SLACK_RECIPIENT}\", \"text\":\":rocket: *Deploy performed on \`$(env)\`*\n- from *branch* \`$(branch)\` (\`$(commit)\`),\n- using *Cardano Node* version \`$(cardano_node_image_tag)\`,\n- using *Cardano DB Sync* version \`$(cardano_db_sync_image_tag)\`,\n- using *GovTool backend* version \`$(backend_image_tag)\`,\n- using *Govtool frontend* version \`$(frontend_image_tag)\`.\n$(pipeline_info)\" }"
