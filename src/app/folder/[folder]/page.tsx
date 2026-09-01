import Navigation from "@/components/navigation";
import Drive from "@/components/drive/drive";
import Header from "@/components/header";
import { DriveHeader } from "@/components/drive/header";
import { Error } from "@/components/error";
import { getFiles, getFolder, getFolders } from "@/app/actions";

export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ folder: string }>;
}) {
  const { folder } = await params;
  const { files, error: filesError } = await getFiles(folder);
  const { folders, error: foldersError } = await getFolders(folder);
  const { folder: currentFolder, error: currentFolderErrror } = await getFolder(
    folder,
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-100/40 dark:bg-gray-800/40">
      <Navigation current="folder" />
      <div className="flex-1 flex flex-col min-h-0">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          {!!filesError && <Error message={JSON.stringify(filesError)}></Error>}
          {!!foldersError && (
            <Error message={JSON.stringify(foldersError)}></Error>
          )}
          {!!currentFolderErrror && (
            <Error message={JSON.stringify(currentFolderErrror)}></Error>
          )}
          <DriveHeader parent={currentFolder?.id} name={currentFolder?.name} />
          <Drive files={files} folders={folders} folder={currentFolder} />
        </main>
      </div>
    </div>
  );
}
