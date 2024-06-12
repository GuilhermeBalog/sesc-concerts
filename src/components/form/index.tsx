import { TreeSelect } from 'antd';
import React from 'react';

import places from './places.json'
import { useActivities } from '@/contexts/activities';

import styles from './styles.module.scss'

export function Form() {
  const { placesFilter, setPlacesFilter } = useActivities();

  return (
    <div className={styles.form}>
      <TreeSelect
        treeData={places}
        value={placesFilter}
        onChange={newValue => {
          setPlacesFilter(newValue)
        }}
        treeCheckable
        showCheckedStrategy={TreeSelect.SHOW_CHILD}
        treeDefaultExpandedKeys={['litoral']}
        placeholder="Selecione as unidades desejadas"
        style={{width: '100%'}}
      />
    </div>
  )
}