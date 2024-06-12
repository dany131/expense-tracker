export const RegexConstants = {
  ONLY_LETTERS_SPACES: /^[A-Za-z\s]+$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
  YEAR: /^\d{4}$/,
  LOCATION: {
    LATITUDE: /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/,
    LONGITUDE: /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/
  }
};