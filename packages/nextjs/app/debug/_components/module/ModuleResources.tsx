import { ModuleResource } from "./ModuleResource";
import { useGetAccountResources } from "~~/hooks/scaffold-move";
import { Module, ModuleName } from "~~/utils/scaffold-move/module";

interface ModuleResourcesProps {
  deployedModuleData: Module<ModuleName>;
}

export const ModuleResources = ({ deployedModuleData }: ModuleResourcesProps) => {
  const { isLoading, data, error } = useGetAccountResources(deployedModuleData.abi.address);

  if (error) {
    return (
      <div>
        <p>Cannot fetch resources.</p>
        {error.type && <p>Error: {error.type}</p>}
        {error.message && <p>Error message: {error.message}</p>}
      </div>
    );
  }

  if (!data?.length) {
    return <p>No resources available.</p>;
  }

  return (
    <div>
      {isLoading && <span className="loading loading-spinner loading-xs"></span>}

      {data.map((resource, index) => (
        <ModuleResource key={index} resource={resource} collapsedByDefault />
      ))}
    </div>
  );
};
