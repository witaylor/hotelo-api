export const authClient = {
  /**
   * Authorises a request.
   *
   * @throws if unauthorised request
   */
  basicAuth: (apiKey: string | null = null): void => {
    if (apiKey === process.env.REQUEST_AUTH_KEY) {
      return;
    }

    throw new Error("Unauthorised request.");
  },
};
