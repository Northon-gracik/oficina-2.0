
export const convertToDateJS = (date: number[]): Date => new Date(
    date[0], // Ano
    date[1] - 1, // Mês (subtrai 1)
    date[2], // Dia
    date[3], // Hora
    date[4]  // Minuto
);

// Função para formatar a data no padrão dd/MM/yyyy --:--
export const formatarData = (data: Date): string => {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa em 0, então somamos 1
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
}