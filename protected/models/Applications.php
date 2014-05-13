<?php

/**
 * This is the model class for table "applications".
 *
 * The followings are the available columns in table 'applications':
 * @property integer $application_id
 * @property integer $project_id
 * @property integer $type_id
 * @property string $name
 * @property string $description
 * @property string $accessibility
 * @property string $repository_url
 * @property string $instructions
 * @property string $rd_point_person
 * @property string $production_date
 * @property string $termination_date
 * @property string $date_created
 * @property string $date_updated
 */
class Applications extends CActiveRecord
{
    /**
     * @return string the associated database table name
     */
    public function tableName()
    {
        return 'applications';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('project_id, type_id, accessibility, date_created, date_updated', 'required'),
            array('project_id, type_id', 'numerical', 'integerOnly'=>true),
            array('name, rd_point_person', 'length', 'max'=>255),
            array('accessibility', 'length', 'max'=>7),
            array('description, repository_url, instructions, production_date, termination_date', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('application_id, project_id, type_id, name, description, accessibility, repository_url, instructions, rd_point_person, production_date, termination_date, date_created, date_updated', 'safe', 'on'=>'search'),
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
            'application_id' => 'Application',
            'project_id' => 'Project',
            'type_id' => 'Type',
            'name' => 'Name',
            'description' => 'Description',
            'accessibility' => 'Accessibility',
            'repository_url' => 'Repository Url',
            'instructions' => 'Instructions',
            'rd_point_person' => 'R&D Point Person',
            'production_date' => 'Production Date',
            'termination_date' => 'Termination Date',
            'date_created' => 'Date Created',
            'date_updated' => 'Date Updated',
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

        $criteria->compare('application_id',$this->application_id);
        $criteria->compare('project_id',$this->project_id);
        $criteria->compare('type_id',$this->type_id);
        $criteria->compare('name',$this->name,true);
        $criteria->compare('description',$this->description,true);
        $criteria->compare('accessibility',$this->accessibility,true);
        $criteria->compare('repository_url',$this->repository_url,true);
        $criteria->compare('instructions',$this->instructions,true);
        $criteria->compare('rd_point_person',$this->rd_point_person,true);
        $criteria->compare('production_date',$this->production_date,true);
        $criteria->compare('termination_date',$this->termination_date,true);
        $criteria->compare('date_created',$this->date_created,true);
        $criteria->compare('date_updated',$this->date_updated,true);

        return new CActiveDataProvider($this, array(
            'criteria'=>$criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Applications the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
}