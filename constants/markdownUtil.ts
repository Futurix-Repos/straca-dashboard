export function htmlToPlainText(html: string, { maxLines, maxLength }: { maxLines: number; maxLength: number }): string {
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(html, 'text/html');
    let plainText = parsedDocument.body.textContent || '';

    // Limit the number of lines
    const lines = plainText.split('\n').slice(0, maxLines);
    plainText = lines.join('\n');

    // Limit the maximum length
    plainText = plainText.slice(0, maxLength);

    return plainText;
}

export function getFormatedDate(dateString: string) {
    const date: Date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    const formattedDate: string = new Intl.DateTimeFormat('fr-FR', options).format(date);

    const formattedDateString: string = formattedDate.toUpperCase();

    return formattedDateString;
}