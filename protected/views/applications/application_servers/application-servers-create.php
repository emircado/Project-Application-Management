<?php
    $server_types = ZHtml::enumItem(Servers::model(), 'server_type');
    $select_types = array(''=>'--Select Server Type--') + $server_types;
?>

<!-- create note view -->
<div id="app-servers-create" class="contact-info plain-list" style="display:none;">
    <!-- CONTENT HERE -->
    <form>
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Add Server</b></h3>&nbsp&nbsp
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <input type="hidden" id="app-servers-create-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Server Type</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <select class="select" id="app-servers-create-type">
                            <?php
                                foreach($select_types as $key => $value)
                                {
                                    ?>
                                    <option value="<?= $key ?>"><?= $value ?></option>
                                    <?php
                                }
                            ?>
                        </select>
                        <span id="app-servers-create-type-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div id="app-servers-create-more" style="display:none;">
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Server</span></div>
                        <div id="app-servers-create-modal-container" class="field-primary" style="width:325px;">
                            <div class="pseudo-field">
                            <input id="app-servers-create-server" type="text" class="text" disabled/>
                            <span id="app-servers-create-server-error" class="field-input-name-error error-message" style="display: none;"></span>
                            </div>
                        </div><!-- End Field Primary -->
                        <a id="app-servers-create-advanced-button" style="float:right;" href="#"><img class="search" src="<?= Yii::app()->baseUrl ?>/css/search.png"></img></a>
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Application Path</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field">
                            <input id="app-servers-create-path" type="text" class="text"/>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Application Log</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field">
                            <input id="app-servers-create-log" type="text" class="text"/>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                </div>
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="app-servers-create-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="app-servers-create-save-button">Add</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div><!--END create note-->