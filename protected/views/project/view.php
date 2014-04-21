<?php
/* @var $this ProjectsController */
/* @var $model Projects */

$this->breadcrumbs=array(
    'Projects'=>array('index'),
    $model->name,
);

$this->menu=array(
    array('label'=>'List Projects', 'url'=>array('index')),
    array('label'=>'Create Projects', 'url'=>array('create')),
    array('label'=>'Update Projects', 'url'=>array('update', 'id'=>$model->project_id)),
    array('label'=>'Delete Projects', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->project_id),'confirm'=>'Are you sure you want to delete this item?')),
    array('label'=>'Manage Projects', 'url'=>array('admin')),
);
?>

<h1>View Projects #<?php echo $model->project_id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
    'data'=>$model,
    'attributes'=>array(
        'project_id',
        'name',
        'code',
        'description',
        'status',
        'production_date',
        'termination_date',
        'date_created',
        'date_updated',
    ),
)); ?>