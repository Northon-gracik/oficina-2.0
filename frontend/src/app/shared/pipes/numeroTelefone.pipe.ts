import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numeroTelefone' })
export class numeroTelefonePipe implements PipeTransform {
    transform(value: string | number,
        ocultarAlgunsValores: boolean = false): string {
        let valorFormatado = value + '';
        valorFormatado = valorFormatado
        .padStart(11, '0') // Preenche com zeros à esquerda se necessário
        .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

        return valorFormatado;
    }
}
