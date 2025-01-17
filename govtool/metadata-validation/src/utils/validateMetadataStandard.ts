import { MetadataValidationStatus } from '@enums';
import { cipStandardSchema } from '@schemas';
import { MetadataStandard } from '@types';

/**
 * Validates the metadata against a specific standard.
 * @param data - The metadata to be validated.
 * @param standard - The metadata standard to validate against.
 * @throws {MetadataValidationStatus.INCORRECT_FORMAT} - If the metadata does not conform to the specified standard.
 */
export const validateMetadataStandard = async (
  data: Record<string, unknown>,
  standard: MetadataStandard,
) => {
  try {
    await cipStandardSchema[standard]?.validateAsync(data);
  } catch (error) {
    throw MetadataValidationStatus.INCORRECT_FORMAT;
  }
};
