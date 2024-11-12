/*
{
  "version": 4,
  "terraform_version": "1.4.2",
  "serial": 1,
  "lineage": "87454262-7cbd-6fa5-6633-4821f75ad8e9",
  "outputs": {},
  "resources": [],
  "check_results": null
}

*/

export type TFState = {
  version: number;
  terraform_version: string;
  serial: number;
  lineage: string;
  outputs: Record<string, unknown>;
  resources: TFResource[];
  check_results: unknown;
};

export type TFResource = {
  mode: string;
  type: string;
  name: string;
  instances: TFInstance[];
  attributes: TFAttribute[];
};

export type TFInstance = {
  arn: string;
  attributes: TFAttribute;
};

export type TFAttribute = {
  arn: string;
};
