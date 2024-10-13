import {useQuery} from "@tanstack/react-query";
import { ResponseError } from "./client";
import { useTargetNetwork } from "./scaffold-move/useTargetNetwork";
import { defaultChains, NetworkName } from "~~/utils/scaffold-move/chains";

const { targetNetwork } = useTargetNetwork();

// TODO: store this in util file
export async function fetchJsonResponse(url: string) {
  const response = await fetch(url);
  return await response.json();
}

function getFetchNameUrl(
  network: NetworkName, // TODO make sure this is valid
  address: string,
  isPrimary: boolean,
) {
  const ans_endpoint = defaultChains[network].ans_endpoint;
  if (!ans_endpoint) {
    return undefined;
  }

  // TODO: get these urls from network info
  return isPrimary
    ? `${ans_endpoint}/api/${network}/primary-name/${address}`
    : `${ans_endpoint}/${network}/name/${address}`;
}

export function useGetNameFromAddress(
  address: string,
  shouldCache = false,
  isValidator = false,
) {

  const queryResult = useQuery<string | null, ResponseError>({
    queryKey: ["MNSName", address, shouldCache, targetNetwork.name],
    queryFn: () => {
      
      return genMNSName(address, shouldCache, targetNetwork.name, isValidator);
    },
  });

  return queryResult.data ?? undefined;
}

// this function will return null if ans name not found to prevent useQuery complaining about undefined return
// source for full context: https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4#undefined-is-an-illegal-cache-value-for-successful-queries
async function genMNSName(
  address: string,
  shouldCache: boolean,
  networkName: NetworkName,
  isValidator: boolean,
): Promise<string | null> {
  const primaryNameUrl = getFetchNameUrl(networkName, address, true);

  if (!primaryNameUrl) {
    return null;
  }

  try {
    const {name: primaryName} = await fetchJsonResponse(primaryNameUrl);

    if (primaryName) {
      return primaryName;
    } else if (isValidator) {
      return null;
    } else {
      const nameUrl = getFetchNameUrl(networkName, address, false);

      if (!nameUrl) {
        return null;
      }

      const {name} = await fetchJsonResponse(nameUrl);
      
      return name ?? null;
    }
  } catch (error) {
    console.error(
      `ERROR! Couldn't find MNS name for ${address} on ${networkName}`,
      error,
      typeof error,
    );
  }

  return null;
}
