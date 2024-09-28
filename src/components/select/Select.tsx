import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ISelect, selectConfigDefault } from './Select.model';
import { ifChanged, usePrevious } from 'utils';

interface IProps {
  formControlName?: string;
  config?: ISelect;
  value?: string | number | unknown;
  onChange?: <T>(value: T) => void;
}

const Select = forwardRef<Dropdown, IProps>((props, ref) => {
  const { t } = useTranslation();
  const { config, formControlName, value, onChange } = props || {};
  const [selectConfig, setSelectConfig] = useState<Partial<ISelect>>(selectConfigDefault());
  const prevConfig = usePrevious({ config });

  const setChange = useCallback(
    (e: DropdownChangeEvent) => {
      onChange?.(e.value);
      e.preventDefault();
    },
    [onChange]
  );

  useEffect(() => {
    ifChanged(prevConfig?.config, config, () => {
      setSelectConfig({ ...selectConfigDefault(), ...config });
    });
  }, [config, prevConfig]);

  const { dictData, placeholder, disabled } = selectConfig || {};

  return (
    <Dropdown
      ref={ref}
      className="select-component"
      id={formControlName || ''}
      name={formControlName || ''}
      value={value}
      onChange={setChange}
      options={dictData || []}
      optionLabel={'displayName'}
      optionValue="id"
      placeholder={placeholder ? t(placeholder) : ''}
      panelClassName="select-component-panel"
      disabled={disabled}
    />
  );
});

export default Select;
