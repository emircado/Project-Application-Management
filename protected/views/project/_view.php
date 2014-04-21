<?php
/* @var $this ProjectsController */
/* @var $data Projects */
?>

<div class="view">

    <b><?php echo CHtml::encode($data->getAttributeLabel('project_id')); ?>:</b>
    <?php echo CHtml::link(CHtml::encode($data->project_id), array('view', 'id'=>$data->project_id)); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('name')); ?>:</b>
    <?php echo CHtml::encode($data->name); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('code')); ?>:</b>
    <?php echo CHtml::encode($data->code); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('description')); ?>:</b>
    <?php echo CHtml::encode($data->description); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('status')); ?>:</b>
    <?php echo CHtml::encode($data->status); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('production_date')); ?>:</b>
    <?php echo CHtml::encode($data->production_date); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('termination_date')); ?>:</b>
    <?php echo CHtml::encode($data->termination_date); ?>
    <br />

    <?php /*
    <b><?php echo CHtml::encode($data->getAttributeLabel('date_created')); ?>:</b>
    <?php echo CHtml::encode($data->date_created); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('date_updated')); ?>:</b>
    <?php echo CHtml::encode($data->date_updated); ?>
    <br />

    */ ?>

</div>