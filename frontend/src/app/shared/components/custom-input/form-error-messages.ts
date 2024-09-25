import { FormErrorType } from './form-error.enum';

export const FormErrorMessages: { [key in FormErrorType]: (value?: any) => string } = {
  [FormErrorType.Required]: () => 'Este campo é obrigatório.',
  [FormErrorType.Email]: () => 'Por favor, insira um email válido.',
  [FormErrorType.MinLength]: (value) => `O valor deve ter pelo menos ${value.requiredLength} caracteres.`,
  [FormErrorType.Mismatch]: () => `As senhas são diferentes`,
  // Mensagens de erro usadas no client que devem ser adicionadas à lista FormErrorMessages:
  [FormErrorType.MaxLength]: (value) => `O valor não pode ter mais que ${value.requiredLength} caracteres.`,
  [FormErrorType.Pattern]: () => 'O valor inserido não corresponde ao padrão esperado.',
  [FormErrorType.InvalidAge]: () => 'A idade deve estar entre 18 e 120 anos.',
  [FormErrorType.InvalidCpfCnpj]: () => 'CPF ou CNPJ inválido.',
  [FormErrorType.Min]: (value) => `O valor deve ser maior que value. .`,
  [FormErrorType.Max]: (value) => `O valor deve ser menor que value. .`,
  // Adicione mais mensagens conforme necessário
};
