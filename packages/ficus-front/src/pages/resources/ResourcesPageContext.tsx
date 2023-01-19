import { createContext } from 'react';

interface IResourcesPageContext {
  resourcesNames: IResourcesNames,
  setResourcesNames: (resourcesNames: IResourcesNames) => void,
}

export interface IResourcesNames {
  [type: string]: {
    [id: string]: string
  }
}

export const ResourcesPageContext = createContext<IResourcesPageContext>({ resourcesNames: {}, setResourcesNames: () => {} });
