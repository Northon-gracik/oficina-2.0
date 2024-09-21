import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpfCnpj' })
export class CpfCnpjPipe implements PipeTransform {
    transform(value: string | number,
        ocultarAlgunsValores: boolean = false): string {
        let valorFormatado = value + '';

        // Remove todos os caracteres que não são números
        valorFormatado = valorFormatado.replace(/\D/g, '');

        if (valorFormatado.length <= 11) {
            // Formatação para CPF
            valorFormatado = valorFormatado
                .padStart(11, '0') // Preenche com zeros à esquerda se necessário
                .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

            if (ocultarAlgunsValores) {
                valorFormatado = 'XXX.' + valorFormatado.substr(4, 7) + '-XX';
            }
        } else if (valorFormatado.length <= 14) {
            // Formatação para CNPJ
            valorFormatado = valorFormatado
                .padStart(14, '0') // Preenche com zeros à esquerda se necessário
                .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');

            if (ocultarAlgunsValores) {
                valorFormatado = 'XX.' + valorFormatado.substr(3, 10) + '/XXXX-XX';
            }
        }

        return valorFormatado;
    }
}
