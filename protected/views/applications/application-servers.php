<!-- LIST APPLICATION SERVERS -->
<div id="app-servers-list" sytle="display:block;">
    <!-- CONTENT HERE -->
    <form>
        <input type="hidden" id="app-servers-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <!-- header -->
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Servers</b></h3>&nbsp&nbsp
                    <a id="app-servers-list-create-button" href="#">[Add]</a>
                </div>
            </div>
            <!-- body -->
            <div id="edit-primary-content" class="content">
                <div class="height-limiter">
                    <table>
                        <thead>
                            <tr>                      
                                <th width=''>Name</th>
                                <th width=''>Type</th>
                            </tr>
                        </thead>
                        <tbody id="app-servers-list-table">
                        </tbody>
                    </table>
                </div>
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="app-servers-list-part"></span>
                        <span class="all-page" id="app-servers-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="app-servers-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="app-servers-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

<!-- CREATE APPLICATION SERVERS -->
<?php
    $server_types = ZHtml::enumItem(Servers::model(), 'server_type');
    $select_types = array(''=>'--Select Server Type--') + $server_types;
?>
<div id="app-servers-create" class="contact-info plain-list" style="display:none;">
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
</div>

<!-- VIEW APPLICATION SERVERS -->
<div id="app-servers-view" class="contact-info plain-list" style="display:none;">
    <form>
        <div class="contact-info-details">
            <input type="hidden" id="app-servers-view-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Server Details</b></h3>&nbsp&nbsp
                    <a id="app-servers-edit-button" href="#">[Edit]</a>
                    <a id="app-servers-delete-button" href="#" style="float:right;">[Delete]</a>
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-name" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Type</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-type" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Private IP</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-private" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div id="app-servers-view-details-container" style="display:none;">
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Host</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span id="app-servers-view-host" class="value"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Public IP</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span id="app-servers-view-public" class="value"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                    <div class="field field-input-name">
                        <div class="field-secondary"><span class="label">Network</span></div>
                        <div class="field-primary">
                            <div class="pseudo-field no-border">
                                <span id="app-servers-view-network" class="value"></span>
                            </div>
                        </div><!-- End Field Primary -->
                    </div><!-- End Field -->
                </div>
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Application Path</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-path" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Application Log</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-log" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Created</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-created" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Created by</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-createdby" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Date Updated</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-updated" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Updated by</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-view-updatedby" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <a id="app-servers-view-details-button" href="#" style="margin-left:225px;">[server details]</a>
                <br>
                <a id="app-servers-view-back-button" href="#">[Back]</a>
            </div>
        </div>
    </form>
</div>

<!-- EDIT APPLICATION SERVERS -->
<div id="app-servers-edit" class="contact-info plain-list" style="display:none;">
    <form>
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header">
                    <h3><b>Edit Application Server</b></h3>&nbsp&nbsp
                </div>
            </div>
            <div id="edit-primary-content" class="content">
                <input type="hidden" id="app-servers-edit-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Server</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field no-border">
                            <span id="app-servers-edit-server" class="value"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Application Path</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="app-servers-edit-path" type="text" class="text"/>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Application Log</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="app-servers-edit-log" type="text" class="text"/>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="app-servers-edit-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="app-servers-edit-save-button">Save Changes</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div>