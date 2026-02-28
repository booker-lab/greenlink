import { greenlinkApi } from './packages/lib/src/api/index.ts';

async function test() {
    try {
        const items = await greenlinkApi.getZeroInventoryItems('CUT');
        console.log('Resulting items:', items);
    } catch (e) {
        console.error('Error:', e);
    }
}
test();
