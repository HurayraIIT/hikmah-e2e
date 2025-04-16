import { faker } from '@faker-js/faker';

function randomString() {
    return `${faker.lorem.words({ min: 1, max: 3})} ${new Date().toISOString()}`;
}

function randomSlug(min = 1, max = 3) {
    return faker.lorem.slug({ min, max });
}

export { randomString, randomSlug };