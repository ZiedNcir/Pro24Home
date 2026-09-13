import { createFormData } from '@core/api/form-data';

class FormDataRecorder {
  public entries: Array<[string, unknown]> = [];

  append(key: string, value: unknown) {
    this.entries.push([key, value]);
  }
}

describe('createFormData', () => {
  it('serializes scalar values and arrays with the API field convention', () => {
    const originalFormData = global.FormData;
    global.FormData = FormDataRecorder as unknown as typeof FormData;

    const formData = createFormData({
      enabled: true,
      distance: 12,
      services: [3, 8],
      ignored: null,
    }) as unknown as FormDataRecorder;

    expect(formData.entries).toEqual([
      ['enabled', '1'],
      ['distance', '12'],
      ['services[]', '3'],
      ['services[]', '8'],
    ]);

    global.FormData = originalFormData;
  });
});
