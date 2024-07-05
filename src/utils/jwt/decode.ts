type DecodeInput = {
  token: string;
};

export const decode = ({ token }: DecodeInput) => {
  const parts = token.split('.');

  const payload = parts[1];

  return JSON.parse(atob(payload));
};
