import React, { useState } from 'react';
import { RoomEditorForm } from '@/features/admin/editFloorMap/RoomEditorForm';
import {
  useEditingMapMutators,
  useEditingMapState,
} from '@/features/admin/editFloorMap/hooks/editingMapState';
import { useMapsDataMutators } from '@/features/admin/editFloorMap/hooks/mapState';
import { Building, DBRoom } from '@/types/roomFloormap';

export const RegisterdRoom = (props: { room: DBRoom; building: Building }) => {
  const { roomID, buildingId, room_name } = props.room;
  const [buttonText, setButtonText] = useState('編集');

  const {
    updateCurrentSelectedBuildingIndexByBuildingId,
    setIsEditingRoom,
    setEditingPolygon,
    setEditingRoomId,
  } = useEditingMapMutators();

  const { updateMouseOutRoomColor, updateMouseOverRoomColor } = useMapsDataMutators();

  const { editingPolygon, editingRoomId } = useEditingMapState();

  const handleClick = () => {
    if (buttonText === '編集') {
      // 編集画面を開始
      setEditingRoomId(roomID);
      setIsEditingRoom(true);
      updateCurrentSelectedBuildingIndexByBuildingId(buildingId);
      setButtonText('中止');
    } else if (buttonText === '中止') {
      // 編集終了
      setEditingRoomId(-1);
      setIsEditingRoom(false);
      setEditingPolygon([
        [0, 0],
        [0, 0],
      ]);
      setButtonText('編集');
    }
  };

  if (buttonText === '中止' && roomID !== editingRoomId) {
    setButtonText('編集');
  }

  if (roomID === editingRoomId) {
    // フォームを表示
    return (
      <div
        className='w-full border border-blue-500'
        onMouseOver={() => updateMouseOverRoomColor(roomID)}
        onMouseOut={() => updateMouseOutRoomColor(roomID)}
      >
        <div className='flex'>
          <div className='w-3/4'>{room_name}</div>
          <button
            id={`form_edit_button${roomID}`}
            className='w-1/4 text-center'
            onClick={handleClick}
          >
            {buttonText}
          </button>
        </div>

        <RoomEditorForm
          room={props.room}
          building={props.building}
          editingPolygon={editingPolygon}
        />
      </div>
    );
  }
  // フォームを非表示
  return (
    <div
      className='w-full border border-blue-500'
      onMouseOver={() => updateMouseOverRoomColor(roomID)}
      onMouseOut={() => updateMouseOutRoomColor(roomID)}
    >
      <div className='flex'>
        <div className='w-3/4'>{room_name}</div>
        <button
          id={`form_edit_button${roomID}`}
          className='w-1/4 text-center'
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
