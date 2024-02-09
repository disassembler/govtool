# GovTool Frontend

Installed on your machine:

1. Node.js >= 16 ([official website](https://nodejs.org/en))
2. npm or yarn - for package management

Clone the project

```bash
  git clone https://github.com/IntersectMBO/govtool
```

Fill .env based on env.example file

Go to the project directory

```bash
  cd voltaire-era/govtool/frontend
```

Install dependencies

```bash
  npm install
```

or

```bash
  yarn install
```

Start the server

```bash
npm run dev
```

or

```bash
yarn dev
```

#### Using nix

1. Get [Nix](https://nixos.org/download).

2. Enter `govtool/frontend` directory:

```sh
cd govtool/frontend
```

3. Run `nix-shell`

```sh
nix-shell
```

4. Run project

```sh
npm run dev
```

##### Alternative

You can skip point 3 by using an automatic direnv configuration:

Install [`direnv`](https://direnv.net/):

```sh
nix-env -i direnv
```

Allow direnv configuration in `govtool/frontend`:

```sh
direnv allow govtool/frontend
```

From now on, once you enter the `govtool/frontend` the `nix-shell` with proper
configuration will be propagated.

## Developing

### Frontend Built With

1. TypeScript - ^5.0.2
2. React - ^18.2.0
3. React Router Dom - ^6.13.0
4. Vite - ^4.3.9
5. Material UI - ^5.14.4
6. Storybook - ^7.4.5
7. Axios - ^1.4.0
8. React Query - ^3.39.3
9. React-Hook-Form - ^7.47.0
10. Yup - ^1.3.2
11. Keen-Slider - ^6.8.5
12. Sentry - ^7.77.0
13. Cardano serialization lib - 12.0.0-alpha.13

### Prerequisites

Install [`Git`](https://git-scm.com/) - version control
Recommendetd [`React developer tools`](https://react.dev/learn/react-developer-tools)


## To Develop

### Standard way

1. Install modules

```bash
npm install
```

2. Launch Server

```bash
npm run dev
```

### Using nix

1. Get [Nix](https://nixos.org/download).

2. Enter `govtool/frontend` directory:
```sh
cd govtool/frontend
```

3. Run `nix-shell`
```sh
nix-shell
```

4. Run project
```sh
npm run dev
```

##### Alternative

You can skip point 3 by using an automatic direnv configuration: 

Install [`direnv`](https://direnv.net/):
```sh
nix-env -i direnv
```

Allow direnv configuration in `govtool/frontend`:
```sh
direnv allow govtool/frontend
```

From now on, once you enter the `govtool/frontend` the `nix-shell` with proper
configuration will be propagated.

### Users

The GovTool application can read and display data from the Cardano chain using REST API.
We distinguish two types of users:

#### without a connected wallet who can:
1. see the governance actions along with their details and the number of votes

#### with connected wallet who can:
1.  see the governance actions along with their details and the number of votes.
2.  display the wallet status
3.  delegate his or her voting power in a form of ADA to dReps,
4.  register as DRrep
5.  vote for the governance actions of his or her choice (if the user is registered)