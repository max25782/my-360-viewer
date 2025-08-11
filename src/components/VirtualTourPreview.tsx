import Link from 'next/link';

interface VirtualTourPreviewProps {
  houseId: string;
  houseName: string;
  previewImage?: string;
}

export default function VirtualTourPreview({ 
  houseId, 
  houseName, 
  previewImage = '/Walnut/3D/entry/thumbnail-qwc9E691mj83t8TKcLx5erIxLUnmEEt0.jpg' 
}: VirtualTourPreviewProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div 
        className="aspect-video  rounded-lg overflow-hidden shadow-2xl relative group cursor-pointer"
        style={{
          backgroundImage: `url('${previewImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Link href={`/houses/${houseId}/tour`}>
          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0  bg-opacity-40"></div>
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
            <div className="w-32 h-32 bg-slate-700 bg-opacity-50 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white border-opacity-30 shadow-2xl">
              <div 
                className="w-0 h-0 border-l-white border-t-transparent border-b-transparent ml-2" 
                style={{
                  borderLeftWidth: '20px',
                  borderTopWidth: '12px',
                  borderBottomWidth: '12px'
                }}
              ></div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Preview Info */}
      <div className="mt-4 text-center">
        <p className="text-gray-300 text-sm">
          Preview: Entry room of {houseName} • Click to explore all rooms: Entry, Kitchen, Bedroom, Bathroom, Living Room
        </p>
      </div>
    </div>
  );
}
