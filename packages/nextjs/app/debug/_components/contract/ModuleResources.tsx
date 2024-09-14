import { ModuleResource } from "./ModuleResource";
import { useGetAccountResources } from "~~/hooks/scaffold-move";
import { Module, ModuleName } from "~~/utils/scaffold-move/module";

export const ModuleResources = ({ deployedContractData }: { deployedContractData: Module<ModuleName> }) => {
  const { isLoading, data, error } = useGetAccountResources(deployedContractData.abi!.address);

  if (error) {
    return (
      <>
        Cannot fetch resources.
        {error.type && <p>Error: {error.type}</p>}
        {error.message && <p>Error message: {error.message}</p>}
      </>
    );
  }

  if (!data?.length) {
    return <>No resources</>;
  }
  return (
    <>
      {isLoading && <span className="loading loading-spinner loading-xs"></span>}

      {data.map((resource, index) => (
        <div key={index}>
          <ModuleResource key={index} resource={resource} collapsedByDefault={true} />
        </div>
      ))}
    </>
  );
};
