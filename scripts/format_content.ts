import * as fs from 'fs';
import * as path from 'path';

const contentPath = path.join(__dirname, '../public/generated_content.json');

function formatText(text: string): string {
    if (typeof text !== 'string') return text;

    let lines = text.split('\n');
    let formattedLines: string[] = [];
    let isCodeBlock = false;
    let foundFirstHeading = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        if (line.startsWith('```')) {
            isCodeBlock = !isCodeBlock;
            formattedLines.push(lines[i]);
            continue;
        }

        if (isCodeBlock) {
            formattedLines.push(lines[i]);
            continue;
        }

        // 1 & 2. Hierarquia visual (H1 para o título, H2 para o resto)
        if (line.match(/^#{1,6}\s/)) {
            if (!foundFirstHeading) {
                line = line.replace(/^#{1,6}\s/, '# ');
                foundFirstHeading = true;
            } else {
                line = line.replace(/^#{1,6}\s/, '## ');
            }
        }

        // 3. Listas: Itens em negrito sequenciais -> lista com marcadores
        // Pega linhas que começam com **Palavra**: ... e não estão em lista
        if (line.match(/^\*\*[^*]+\*\*\s*[:\-]?\s+[A-Za-z0-9]/) && !line.match(/^[\-\*]\s/) && !line.match(/^\d+\.\s/)) {
            line = '- ' + line;
        }

        // Se era uma lista numerada (ex: 1. **Termo**: Descrição), vamos trocar para marcador (-)
        if (line.match(/^\d+\.\s+\*\*[^*]+\*\*\s*[:\-]?\s+/)) {
            line = line.replace(/^\d+\.\s+/, '- ');
        }

        // 4. Callout: Dados Estatísticos
        if (line.length > 20 && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('-')) {
            if (/\b\d+(?:,\d+)?%/.test(line)) {
                line = '> 💡 **Dado Estatístico:** ' + line;
            }
        }

        formattedLines.push(line);
    }

    let newText = formattedLines.join('\n');

    // 5. Espaçamento
    newText = newText.replace(/\n{3,}/g, '\n\n');
    
    // Linha em branco após H2
    newText = newText.replace(/^(##\s+.*)\n([^\n])/gm, '$1\n\n$2');

    // Linha em branco entre itens de lista (marcadores '-' ou '*')
    newText = newText.replace(/^([\-\*]\s+.*)$/gm, '$1\n');

    // Remove quebras triplas
    newText = newText.replace(/\n{3,}/g, '\n\n');

    return newText.trim();
}

try {
    const data = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    let changed = 0;

    for (const key of Object.keys(data)) {
        if (typeof data[key] === 'string') {
            data[key] = formatText(data[key]);
            changed++;
        }
    }

    fs.writeFileSync(contentPath, JSON.stringify(data, null, 2));
    console.log(`Final formatting run: ${changed} blocks modified.`);
} catch (error) {
    console.error(error);
}
