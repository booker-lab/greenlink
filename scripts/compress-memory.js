const fs = require('fs');
const path = require('path');

const memoryPath = path.join(__dirname, 'docs', 'memory.md');
let content = '';
try {
    content = fs.readFileSync(memoryPath, 'utf8');
} catch (e) {
    console.error('Failed to read memory.md:', e);
    process.exit(1);
}

const parts = content.split('## [Antigravity Task]');

if (parts.length <= 3) {
    console.log('Not enough tasks to compress. Current parts:', parts.length);
    process.exit(0);
}

const recentTasksCount = 2; // Keep the two most recent tasks fully
const tasksToCompress = parts.slice(1, parts.length - recentTasksCount);
const recentTasks = parts.slice(parts.length - recentTasksCount);

let summaryText = "";
tasksToCompress.forEach(task => {
    const lines = task.split('\n');
    const titleLine = lines[0].trim();

    // Try to extract Context or Technical Note if possible for a brief summary
    let context = "";
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('### [Context]')) {
            context = lines[i + 1] ? lines[i + 1].replace(/^- /, '').trim() : '';
            break;
        }
    }

    summaryText += `- **${titleLine.replace(/^- /, '')}**: ${context}\n`;
});

let headerExists = parts[0].includes('## Executive Summary');

let newContent = `## Executive Summary
*과거 로그 압축 (200줄 유지 프로토콜에 의한 아카이빙)*

${summaryText}
`;

recentTasks.forEach(task => {
    newContent += `## [Antigravity Task]${task}`;
});

fs.writeFileSync(memoryPath, newContent, 'utf8');
const newLineCount = newContent.split('\n').length;
console.log(`Compression done. New line count: ${newLineCount}`);
