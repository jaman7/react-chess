import { IFormElements } from 'components/formElements/FormElements.model';

export const createConfigForm = (
  formConfig: IFormElements,
  params: {
    prefix?: string;
    dictionaries?: any;
    isNoPlaceholderAll?: boolean;
    isHeaderAll?: boolean;
    isDisableAll?: boolean;
  } = {}
): IFormElements[] => {
  return Object.keys(formConfig).map((key: string) => {
    const { prefix, dictionaries, isNoPlaceholderAll, isHeaderAll, isDisableAll } = params;
    const config = formConfig[key]?.config || {};

    return {
      formControlName: key,
      type: config.type,
      config: {
        ...config,
        prefix,
        header: config.header ?? `${prefix}.${key}`,
        placeholder: isNoPlaceholderAll ? '' : (config.placeholder ?? `${prefix}.${key}`),
        dictData: config.dictData ?? dictionaries?.[config.dictName ?? key] ?? [],
        isHeader: isHeaderAll ?? config.isHeader ?? true,
        disabled: isDisableAll ?? config.disabled ?? false,
        value: config.value ?? null,
      },
    };
  });
};
