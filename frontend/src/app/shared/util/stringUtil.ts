export const camelCaseToFrontendStyle = (str: string): string => {
    return str
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')  // Separa siglas de palavras seguintes (ex: "GPSData" vira "GPS Data")
        .replace(/([a-z])([A-Z])/g, '$1 $2')         // Adiciona um espaço antes de cada letra maiúscula
        .replace(/^./, (match) => match.toUpperCase()) // Capitaliza a primeira letra da string
        .trim(); // Remove espaços desnecessários no início ou fim
}

export const frontendStyleToCamelCase = (str: string): string => {
    return str
        .split(' ')
        .map((word, index) => {
            // Se a palavra é uma sigla (todas letras maiúsculas), mantém como está
            if (word === word.toUpperCase() && word.length > 1) {
                return word;
            }
            // Para a primeira palavra, mantém em minúsculas, e para as outras, capitaliza a primeira letra
            return index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
}

export const generateRandomId = (): string => 'input_' + Math.random().toString(36).substr(2, 9);