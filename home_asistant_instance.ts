import axios, { AxiosInstance } from 'axios';

export class HomeAssistantInstance {
    private axios: AxiosInstance 

    constructor(host: string, token: string) {
        this.axios = axios.create({
            baseURL: host,
            timeout: 5000,
            headers: {'Authorization': 'Bearer ' + token}
        });
    }

    static parseResponse(response: any): any {
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
    
    async doGet(url: string): Promise<any> {
      try {
        const response = await this.axios.get(url);
        return HomeAssistantInstance.parseResponse(response);
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    
    async doPost(url: string, data: any): Promise<any> {
      try {
        const response = await this.axios.post(url, data);
        return HomeAssistantInstance.parseResponse(response);
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    
    async getStates(): Promise<any> {
      return this.doGet(`/api/states`);
    }
    
    async getEvents(): Promise<any> {
      return this.doGet(`/api/events`);
    }
    
    async getServices(): Promise<any> {
      return this.doGet(`/api/services`);
    }

    async getState(entityId: string): Promise<any> {
        return this.doGet(`/api/states/${entityId}`);
      }
      
    async getEntities(type: 'sensor' | 'binary_sensor' | 'switch'): Promise<any> {
        const data = {
            template: `{{ states.${type} | map(attribute='entity_id') | list }}`
        }
        return this.doPost(`/api/template`, data);
    }
}