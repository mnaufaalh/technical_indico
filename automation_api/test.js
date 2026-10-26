import { faker } from '@faker-js/faker';

import { expect } from 'chai';

const baseUrl = 'https://petstore.swagger.io/v2';

const randomStatus = faker.helpers.arrayElement(['available', 'pending', 'sold']);

describe('automation POST', () => {
  const nameOfAnimal = `${faker.animal.petName()} the ${faker.animal.type()}`;

  it('Should be success to add new pet to the store', async () => {
    const bodyRequest = {
      id: 0,
      category: {
        id: 0,
        name: 'string',
      },
      name: nameOfAnimal,
      photoUrls: ['string'],
      tags: [
        {
          id: 0,
          name: 'string',
        },
      ],
      status: randomStatus,
    };

    const response = await fetch(`${baseUrl}/pet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    const statusCode = response.status;
    const responseBody = await response.json();

    const id = responseBody.id
    const propertyName = responseBody.name
    const photoUrl = responseBody.photoUrls
    const tags = responseBody.tags
    const status = responseBody.status
    expect(statusCode).to.equal(200)
    expect(typeof (responseBody)).to.equal('object')
    expect(Object.hasOwn(responseBody, 'id')).to.equal(true)
    expect(Object.hasOwn(responseBody, 'name')).to.equal(true)
    expect(Object.hasOwn(responseBody, 'tags')).to.equal(true)
    expect(Object.hasOwn(responseBody, 'status')).to.equal(true)
    expect(typeof (id)).to.equal('number')
    expect(typeof (propertyName)).to.equal('string')
    expect(Array.isArray(photoUrl)).to.equal(true)
    expect(Array.isArray(tags)).to.equal(true)
    expect(typeof (status)).to.equal('string')
    expect(propertyName).to.equal(nameOfAnimal)
    expect(status).to.equal(randomStatus)
  })

  it('Should be fail to add new pet to the store if mandatory field is empty', async () => {
    const bodyRequest = {
      "id": 0,
      "category": {
        "id": 0,
        "name": "string"
      },
      "tags": [
        {
          "id": 0,
          "name": "string"
        }
      ],
      "status": randomStatus
    }

    const response = await fetch(`${baseUrl}/pet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyRequest),
    });

    const statusCode = response.status;
    expect(statusCode).to.equal(405)
  })
});

describe('automation GET ', function () {
  it('Should be success to find pet by status', async () => {
    const params = new URLSearchParams({
      status: randomStatus,
    });

    const response = await fetch(
      `${baseUrl}/pet/findByStatus?${params.toString()}`
    );

    const statusCode = response.status
    const responseBody = await response.json();
    expect(statusCode).to.equal(200)
    expect(Array.isArray(responseBody)).to.equal(true)
    responseBody.forEach((pet, index) => {
        const id = pet.id
        const photoUrls = pet.photoUrls
        const tags = pet.tags
        const propertyStatus = pet.status
        expect(typeof (id)).to.equal('number')
        expect(Array.isArray(photoUrls)).to.equal(true)
        expect(Array.isArray(tags)).to.equal(true)
        expect(typeof (propertyStatus)).to.equal('string')
        expect(propertyStatus).to.equal(randomStatus)
    })
  })

  it('Should be fail to find pet by invalid status', async () => {
    const invalidStatus = 'JUAL';

    const params = new URLSearchParams({
      status: invalidStatus,
    });

    const response = await fetch(
      `${baseUrl}/pet/findByStatus?${params.toString()}`
    );

    const statusCode = response.status;
    const responseBody = await response.json();

    expect(statusCode).to.equal(400)
    expect(Array.isArray(responseBody)).to.equal(true)
    responseBody.forEach((pet, index) => {
        const id = pet.id
        const name = pet.name
        const photoUrls = pet.photoUrls
        const tags = pet.tags
        const propertyStatus = pet.status
        expect(typeof (id)).to.equal('number')
        expect(typeof (name)).to.equal('string')
        expect(Array.isArray(photoUrls)).to.equal(true)
        expect(Array.isArray(tags)).to.equal(true)
        expect(typeof (propertyStatus)).to.equal('string')
        expect(propertyStatus).to.equal(invalidStatus)
    })
  })
});

describe('automation Delete', function () {
  it('Should be success to delete pet', async () => {
  const response = await fetch(`${baseUrl}/pet/10`, {
    method: 'DELETE',
  });

    expect(response.status).to.equal(200);
  });

  it('Should be fail to delete pet by invalid id', async () => {
    const response = await fetch(`${baseUrl}/pet/999999999`, {
      method: 'DELETE',
    });

    expect(response.status).to.equal(404);
  });
});
