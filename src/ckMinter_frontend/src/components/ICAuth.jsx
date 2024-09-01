import { AuthClient } from "@dfinity/auth-client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createicrc1Actor } from "../IC/icpswap/icrc1";
import { Principal } from "@dfinity/principal";
import { principalToBytes32 } from "../utils/principalTo32";

const AuthContext = createContext(null);

const defaultOptions = {
  /**
   *  @type {import("@dfinity/auth-client").AuthClientCreateOptions}
   */
  createOptions: {
    idleOptions: {
      // Set to true if you do not want idle functionality
    },
  },
  /**
   * @type {import("@dfinity/auth-client").AuthClientLoginOptions}
   */
  loginOptions: {
    identityProvider: "https://identity.ic0.app/#authorize",
  },
};

/**
 *
 * @param options - Options for the AuthClient
 * @param {AuthClientCreateOptions} options.createOptions - Options for the AuthClient.create() method
 * @param {AuthClientLoginOptions} options.loginOptions - Options for the AuthClient.login() method
 * @returns
 */
export const useAuthClient = (options = defaultOptions) => {
  const [isAuth, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState(null);
  const [principalText, setPrincipalText] = useState(null);
  const [tokenAactor, setTokenAactorState] = useState(null);
  const [tokenBactor, setTokenBactorState] = useState(null);
  const [principal32, setPrincipal32] = useState(null);

  useEffect(() => {
    // Initialize AuthClient
    AuthClient.create(options.createOptions).then(async (client) => {
      console.log("coool", client);
      updateClient(client);
    });
  }, []);

  const login = () => {
    authClient.login({
      ...options.loginOptions,
      onSuccess: () => {
        console.log("on sucess");
        updateClient(authClient);
      },
    });
  };

  async function updateClient(client) {
    const isAuthenticated = await client.isAuthenticated();
    console.log("updating client", isAuthenticated);
    setIsAuthenticated(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    const principal = identity.getPrincipal();
    console.log("principal", principal);
    let principalText = Principal.fromUint8Array(principal._arr).toText();
    let principal32 = principalToBytes32(principalText);
    setPrincipal32(principal32);
    console.log("principalText", principalText,principal32);

    let icpCanister = "ryjl3-tyaaa-aaaaa-aaaba-cai";

    let Aactor = createicrc1Actor(icpCanister, {
      agentOptions: {
        identity,
      },
    });

    let Bactor = createicrc1Actor("xevnm-gaaaa-aaaar-qafnq-cai", {
      agentOptions: {
        identity,
      },
    });

    setPrincipalText(principalText);
    setPrincipal(principal);
    setTokenAactorState(Aactor);
    setTokenBactorState(Bactor);
    setAuthClient(client);
  }

  async function logout() {
    await authClient?.logout();
    await updateClient(authClient);
  }

  return {
    isAuth,
    login,
    logout,
    authClient,
    identity,
    principal,
    tokenAactor,
    tokenBactor,
    principalText,
    principal32,
  };
};

/**
 * @type {React.FC}
 */
export const AuthProvider = ({ children }) => {
  const auth = useAuthClient();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
