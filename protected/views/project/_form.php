<?php
/* @var $this ProjectsController */
/* @var $model Projects */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
    'id'=>'projects-form',
    // Please note: When you enable ajax validation, make sure the corresponding
    // controller action is handling ajax validation correctly.
    // There is a call to performAjaxValidation() commented in generated controller code.
    // See class documentation of CActiveForm for details on this.
    'enableAjaxValidation'=>false,
)); ?>

    <p class="note">Fields with <span class="required">*</span> are required.</p>

    <?php echo $form->errorSummary($model); ?>

    <div class="row">
        <?php echo $form->labelEx($model,'name'); ?>
        <?php echo $form->textField($model,'name',array('size'=>60,'maxlength'=>255)); ?>
        <?php echo $form->error($model,'name'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model,'code'); ?>
        <?php echo $form->textField($model,'code',array('size'=>10,'maxlength'=>10)); ?>
        <?php echo $form->error($model,'code'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model,'description'); ?>
        <?php echo $form->textArea($model,'description',array('rows'=>6, 'cols'=>50)); ?>
        <?php echo $form->error($model,'description'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model,'status'); ?>
        <?php echo $form->textField($model,'status',array('size'=>10,'maxlength'=>10)); ?>
        <?php echo $form->error($model,'status'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model,'production_date'); ?>
        <?php echo $form->textField($model,'production_date'); ?>
        <?php echo $form->error($model,'production_date'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model,'termination_date'); ?>
        <?php echo $form->textField($model,'termination_date'); ?>
        <?php echo $form->error($model,'termination_date'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model,'date_created'); ?>
        <?php echo $form->textField($model,'date_created'); ?>
        <?php echo $form->error($model,'date_created'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model,'date_updated'); ?>
        <?php echo $form->textField($model,'date_updated'); ?>
        <?php echo $form->error($model,'date_updated'); ?>
    </div>

    <div class="row buttons">
        <?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
    </div>

<?php $this->endWidget(); ?>

</div><!-- form -->