import React from 'react'
import { useRubikConverter } from '@/hooks/use-rubik-converter'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/Sheet'
import RubikCrossNet from './RubikCrossNet'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const RubikCubeDetail: React.FC = () => {
  const { panelOpen, closePanel, selectedCubeData, navigateCube } = useRubikConverter()

  return (
    <Sheet open={panelOpen} onOpenChange={(open) => { if (!open) closePanel() }}>
      <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto px-4 sm:px-6">
        <SheetHeader>
          <SheetTitle className="text-base sm:text-lg">
            {selectedCubeData
              ? `Cube [${selectedCubeData.row + 1}, ${selectedCubeData.col + 1}]`
              : 'Cube Detail'
            }
          </SheetTitle>
          <SheetDescription className="text-xs sm:text-sm">
            Front face configuration and cross-net view
          </SheetDescription>
        </SheetHeader>

        {selectedCubeData && (
          <div className="flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-6">
            {/* Cross-net diagram */}
            <div className="bg-base-200 rounded-xl p-3 sm:p-4">
              <RubikCrossNet frontFace={selectedCubeData.cells} />
            </div>

            {/* Legend */}
            <div className="text-xs opacity-60 text-center">
              <p>Front face: colors from your image</p>
              <p>Other faces: placeholder (v2.0)</p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                className="btn btn-ghost btn-sm gap-1"
                onClick={() => navigateCube('prev')}
              >
                <FiChevronLeft /> Prev
              </button>
              <span className="text-sm opacity-50">
                Row {selectedCubeData.row + 1}, Col {selectedCubeData.col + 1}
              </span>
              <button
                className="btn btn-ghost btn-sm gap-1"
                onClick={() => navigateCube('next')}
              >
                Next <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default RubikCubeDetail
