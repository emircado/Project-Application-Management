<?php

/**
 * This is the model class for table "project_notes".
 *
 * The followings are the available columns in table 'project_notes':
 * @property integer $note_id
 * @property integer $project_id
 * @property integer $application_id
 * @property string $notes
 * @property string $date_created
 * @property string $date_updated
 * @property string $created_by
 * @property string $updated_by
 */
class Notes extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'project_notes';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('project_id, date_created, date_updated', 'required'),
            array('project_id, application_id', 'numerical', 'integerOnly'=>true),
            array('created_by, updated_by', 'length', 'max'=>255),
            array('notes', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('note_id, project_id, application_id, notes, date_created, date_updated, created_by, updated_by', 'safe', 'on'=>'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels()
    {
        return array(
            'note_id' => 'Note',
            'project_id' => 'Project',
            'application_id' => 'Application',
            'notes' => 'Notes',
            'date_created' => 'Date Created',
            'date_updated' => 'Date Updated',
            'created_by' => 'Created By',
            'updated_by' => 'Updated By',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     *
     * Typical usecase:
     * - Initialize the model fields with values from filter form.
     * - Execute this method to get CActiveDataProvider instance which will filter
     * models according to data in model fields.
     * - Pass data provider to CGridView, CListView or any similar widget.
     *
     * @return CActiveDataProvider the data provider that can return the models
     * based on the search/filter conditions.
     */
    public function search()
    {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria=new CDbCriteria;

        $criteria->compare('note_id',$this->note_id);
        $criteria->compare('project_id',$this->project_id);
        $criteria->compare('application_id',$this->application_id);
        $criteria->compare('notes',$this->notes,true);
        $criteria->compare('date_created',$this->date_created,true);
        $criteria->compare('date_updated',$this->date_updated,true);
        $criteria->compare('created_by',$this->created_by,true);
        $criteria->compare('updated_by',$this->updated_by,true);

        return new CActiveDataProvider($this, array(
            'criteria'=>$criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Notes the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
}