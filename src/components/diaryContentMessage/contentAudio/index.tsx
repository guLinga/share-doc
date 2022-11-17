import React from 'react'
import { useEffect } from 'react';
import { getUserMedia } from '../../../utils/audio';

export default function ContentAudio() {
  useEffect(() => {
    getUserMedia();
  }, [])
  return (
    <div>

    </div>
  )
}
