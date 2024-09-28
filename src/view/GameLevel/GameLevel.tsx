import FormElements from 'components/formElements/FormElements';
import { inject, observer } from 'mobx-react';
import { useCallback, useEffect, useState } from 'react';
import { IStoreProps } from 'store/Store.model';
import { createConfigForm } from 'utils/create-form';
import { ConfigControlsNames, dictionaries, formConfig } from './GameLevel.config';
import { FormProvider, useForm } from 'react-hook-form';
import { IFormElements } from 'components/formElements/FormElements.model';

const { DIFFICULTY } = ConfigControlsNames;

const GameLevel = (props: IStoreProps) => {
  const { Store } = props;
  const { gameStarted } = Store || {};

  const formMethods = useForm({
    defaultValues: {
      difficulty: 2,
    },
  });

  const [formConfig$, setFormConfig$] = useState<IFormElements[]>([]);
  const watchDifficulty = formMethods.watch(DIFFICULTY);

  useEffect(() => {
    setFormConfig$(createConfigForm(formConfig, { prefix: `form` }));
  }, []);

  useEffect(() => {
    Store?.setDifficultyLevel?.(watchDifficulty);
  }, [watchDifficulty, Store]);

  const getDisableState = useCallback(
    (name: string) => {
      return name === DIFFICULTY ? gameStarted : false;
    },
    [gameStarted]
  );

  const itemsConfig = useCallback(
    (data: any, name: string) => ({
      ...data,
      disabled: getDisableState(name),
      dictData: dictionaries?.[data?.dictName] ?? [],
    }),
    [getDisableState]
  );

  return (
    <FormProvider {...formMethods}>
      <form className="d-flex ms-3">
        {formConfig$?.map(item => (
          <FormElements
            key={item.formControlName}
            formControlName={item.formControlName}
            config={itemsConfig(item.config, item.formControlName)}
          />
        ))}
      </form>
    </FormProvider>
  );
};

export default inject('Store')(observer(GameLevel));
