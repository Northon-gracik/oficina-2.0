import { FormControl } from "@angular/forms";
import { FormErrorType } from "../components/custom-input/form-error.enum";

export function cpfCnpjValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value) {
        if (value.length === 11) {
            return isValidCPF(value) ? null : { [FormErrorType.InvalidCpfCnpj]: true };
        } else if (value.length === 14) {
            return isValidCNPJ(value) ? null : { [FormErrorType.InvalidCpfCnpj]: true };
        }
    }
    return { [FormErrorType.InvalidCpfCnpj]: true };
}

export function isValidCPF(cpf: string): boolean {
    const cpfValido = /^(\d{11})$/;
    const cpfLimpo = cpf.replace(/\D/g, '');

    if (!cpfValido.test(cpfLimpo)) {
        return false;
    }

    if (cpfLimpo[0].repeat(11) === cpfLimpo) {
        return false;
    }
    
    let soma = 0;
    let peso = 10;

    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i), 10) * peso;
        peso--;
    }

    let digito = soma % 11;

    if (digito < 2) {
        digito = 0;
    } else {
        digito = 11 - digito;
    }

    if (digito !== parseInt(cpfLimpo.charAt(9), 10)) {
        return false;
    }

    soma = 0;
    peso = 11;

    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i), 10) * peso;
        peso--;
    }

    digito = soma % 11;

    if (digito < 2) {
        digito = 0;
    } else {
        digito = 11 - digito;
    }

    if (digito !== parseInt(cpfLimpo.charAt(10), 10)) {
        return false;
    }

    return true;
}

export function isValidCNPJ(cnpj: string): boolean {
    const cnpjValido = /^(\d{14})$/;
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    if (!cnpjValido.test(cnpjLimpo)) {
        return false;
    }

    if (cnpjLimpo[0].repeat(14) === cnpjLimpo) {
        return false;
    }

    const calcularDigito = (base: string, pesoInicio: number) => {
        let soma = 0;
        let peso = pesoInicio;

        for (const char of base) {
            soma += parseInt(char, 10) * peso;
            peso = peso === 2 ? 9 : peso - 1;
        }

        const digito = soma % 11;
        return digito < 2 ? 0 : 11 - digito;
    };

    const baseCnpj = cnpjLimpo.slice(0, 12);
    const primeiroDigito = calcularDigito(baseCnpj, 5);
    const segundoDigito = calcularDigito(baseCnpj + primeiroDigito, 6);

    return primeiroDigito === parseInt(cnpjLimpo.charAt(12), 10) &&
           segundoDigito === parseInt(cnpjLimpo.charAt(13), 10);
}
