import axios, { AxiosInstance } from 'axios';
import config from '../config';

const instance: AxiosInstance = axios.create({
    baseURL: 'http://' + config.host,
    timeout: 5000,
    headers: {'Authorization': 'Bearer ' + config.token}
});

function parseResponse(response: any) {
  // console.log(response.data);
  try {
    return JSON.parse(
      response.data.replace(/^'/, '').replace(/'$/, '').replace(/'/g, '"')
    );
  } catch {}

  try {
    return JSON.parse(
      response.data
    );
  } catch {}

  return response.data;
}

async function doGet(url: string) {
  try {
    const response = await instance.get(url);
    return parseResponse(response);
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function doPost(url: string, data: any) {
  try {
    const response = await instance.post(url, data);
    return parseResponse(response);
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getState(entityId: string) {
  return doGet(`/api/states/${entityId}`);
}

async function getStates() {
  return doGet(`/api/states`);
}

async function getEvents() {
  return doGet(`/api/events`);
}

async function getServices() {
  return doGet(`/api/services`);
}

export async function getEntities(type: 'sensor' | 'binary_sensor' | 'switch') {
  const data = {
    template: `{{ states.${type} | map(attribute='entity_id') | list }}`
  }
  return doPost(`/api/template`, data);
}

async function main() {
  const inputEntities = [
    ...await getEntities('binary_sensor'),
  ];
  const outputEntities = [
    ...await getEntities('switch'),
  ];

  const monitoredEntities = inputEntities.filter(entityId =>
    entityId.endsWith('_motion_detection')
    || entityId.endsWith('_contact')
    || entityId.endsWith('_occupancy')
  );

  const controlledEntities = outputEntities.filter(entityId =>
    entityId.startsWith('switch.switch_')
  );

  console.log(monitoredEntities);
  console.log(controlledEntities);
}

main();

