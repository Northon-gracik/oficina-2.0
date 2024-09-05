import { FormErrorType } from './form-error.enum';

export const FormErrorMessages: { [key in FormErrorType]: (value?: any) => string } = {
  [FormErrorType.Required]: () => 'Este campo é obrigatório.',
  [FormErrorType.Email]: () => 'Por favor, insira um email válido.',
  [FormErrorType.MinLength]: (value) => `O valor deve ter pelo menos ${value.requiredLength} caracteres.`,
  [FormErrorType.Mismatch]: () => `As senhas são diferentes`,
  // Adicione mais mensagens conforme necessário
};
