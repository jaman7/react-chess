import { IFormElementsConfig } from 'components/formElements/FormElements.model';
import { IDictionary } from 'components/select/Select.model';

export const formConfig: IFormElementsConfig = {
  difficulty: { config: { formCellType: 'select', dictName: 'difficultyDict' } },
};

export enum ConfigControlsNames {
  DIFFICULTY = 'difficulty',
}

export const difficultyDict = [
  { displayName: 'very-easy', id: 1 },
  { displayName: 'easy', id: 2 },
  { displayName: 'medium', id: 3 },
  { displayName: 'hard', id: 4 },
  { displayName: 'expert', id: 5 },
];

export const dictionaries: IDictionary = {
  difficultyDict,
};
