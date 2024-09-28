import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IFormElements } from './FormElements.model';
import Select from 'components/select/Select';
import { Controller, useFormContext } from 'react-hook-form';

interface IProps {
  formControlName: string;
  config: IFormElements;
}

const FormCell = (props: IProps) => {
  const { t } = useTranslation();
  const { config, formControlName } = props;
  const { control } = useFormContext();

  const formCellConfig = useMemo(() => ({ ...config }), [config]);
  const { header, isHeader, formCellClass } = formCellConfig;
  const headerElement = useMemo(() => (isHeader ? <span className="label">{t(header || '')}</span> : null), [isHeader, header, t]);

  const renderFormElement = useMemo(() => {
    switch (formCellConfig?.formCellType) {
      case 'select':
        return (
          <Controller
            name={formControlName}
            control={control}
            render={({ field }) => <Select {...field} formControlName={formControlName} config={formCellConfig} />}
          />
        );
      default:
        return null;
    }
  }, [control, formCellConfig, formControlName]);

  return (
    <div className={`form-cell-component ${formCellClass || ''}`}>
      {headerElement}
      {renderFormElement}
    </div>
  );
};

export default FormCell;
