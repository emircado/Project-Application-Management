<?php
    $server_types = ZHtml::enumItem(Servers::model(), 'server_type');
    $select_types = array(''=>'') + $server_types;
?>

<!-- create note view -->
<div id="create-app-servers-view" class="contact-info plain-list" style="display:none;">
    <!-- CONTENT HERE -->
    <form>
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Add Server</b></h3>&nbsp&nbsp
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Server Type</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <select class="select" id="create-app-servers-type">
                            <?php
                                foreach($select_types as $key => $value)
                                {
                                    ?>
                                    <option value="<?= $key ?>"><?= $value ?></option>
                                    <?php
                                }
                            ?>
                        </select>
                        <span id="create-app-servers-type-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Server</span></div>
                    <div id="create-app-servers-modal-container" class="field-primary">
                        <div class="pseudo-field">
                        <input id="create-app-servers-server" type="text" class="text" style="width:200px"/>
                        <span id="create-app-servers-server-error" class="field-input-name-error error-message" style="display: none;"></span>
                        <a id="create-app-servers-advanced" href="#">Advanced Search</a>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Application Path</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="create-app-servers-path" type="text" class="text"/>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Application Log</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="create-app-servers-log" type="text" class="text"/>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="create-app-servers-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="create-app-servers-add-button">Add</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div><!--END create note-->