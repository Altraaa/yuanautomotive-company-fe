/** CMS section — freeform JSON payload keyed by a section slug. */
export type ApiCmsEntry = {
  key: string;
  data: Record<string, unknown>;
};
