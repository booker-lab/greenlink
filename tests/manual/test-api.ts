import { greenlinkApi } from '@greenlink/lib';

async function test() {
    try {
        const items = await greenlinkApi.getZeroInventoryItems('CUT');
        console.log('Resulting items:', items);
    } catch (e) {
        console.error('Error:', e);
    }
}
test();
