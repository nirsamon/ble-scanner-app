import {run} from 'kotlin-swift-bridge';

export enum RunClassNames {
  ScanBleDevices = 'ScanBleDevices',
}

export type RunProps = {
  className: RunClassNames;
  method?: string;
  url?: string;
  params?: any;
};

export const kotlinRun = async (props: RunProps): Promise<any> => {
  const requestStartedAt = new Date().getTime();
  try {
    const resultString = await run(JSON.stringify(props));
    console.log(
      `Execution time for: ${props.className} - ${
        new Date().getTime() - requestStartedAt
      } ms`,
    );

    const result = JSON.parse(resultString);
    if (result.response) {
      result.response = JSON.parse(result.response);
    }

    return result;
  } catch (error: any) {
    console.warn(
      `Execution time for: ${props.className} - ${
        new Date().getTime() - requestStartedAt
      } ms`,
    );
    throw error;
  }
};
