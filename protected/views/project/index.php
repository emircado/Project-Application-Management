
<?php
/* @var $this ProjectsController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
    'Projects',
);

$this->menu=array(
    array('label'=>'Create Projects', 'url'=>array('create')),
    array('label'=>'Manage Projects', 'url'=>array('admin')),
);
?>

<h1>Projects</h1>

<?php
// $this->widget('zii.widgets.CListView', array( 
$this->widget('zii.widgets.grid.CGridView', array(
    'dataProvider'=>$dataProvider,
    // 'itemView'=>'_view',
    'columns'=>array(
    	'name',
    	'description',
    	'status',
    	// 'production_date',
    	array(
    		'name'=>'production_date',
    		'value'=>'date("M j, Y", strtotime($data->production_date))',
    	),
    	array(	'class'=>'CButtonColumn',	),
    ),
)); ?>