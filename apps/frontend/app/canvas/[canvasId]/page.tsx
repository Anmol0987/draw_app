import CanvasRoom from "../../../component/canvasRoom";
export default async function CanvasPage({ params }: {
    params: {
        canvasId: string
    }
}) {
    const CanvasId = (await params).canvasId;
    console.log(CanvasId);

    return <CanvasRoom canvasId={CanvasId} />;
   
}