<!-- edit applications view -->
<div id="applications-edit" class="contact-info plain-list" style="display:none;">
    <!-- FORM HERE -->
    <form>
        <input type="hidden" id="applications-edit-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="contact-info-details">
            <div class="section primary-info expanded">
                <div id="expand-primary" class="header"><h3><b>Edit Application</b></h3></div>
            </div>
            <!-- CONTENT FOR EDIT Application -->
            <div id="edit-primary-content" class="content">
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Name*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="applications-edit-name" type="text" class="text"></input>
                        <span id="applications-edit-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Type*</span></div>
                    <div id="applications-edit-modal-container" class="field-primary">
                        <div class="pseudo-field">
                        <input id="applications-edit-type" type="text" class="text"/>
                        <span id="applications-edit-type-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Accessibility*</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <?php echo ZHtml::enumDropDownList(Applications::model(), 'accessibility', array(
                            'id'=>'applications-edit-accessibility',
                            'class' => 'select',
                        )); ?>
                        <span id="applications-edit-accessibility-error" class="field-input-name-error error-message" style="display: none;"></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Repository</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="applications-edit-repository" type="text" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Uses Mobile Patterns</span></div>
                    <div class="field-primary" style="padding-top:7px;">
                        <div class="pseudo-field">
                        <input id="applications-edit-pattern" type="checkbox" style="margin-top:5px;"></input>
                        <span style="font-size:12px;"><i>(Check if Yes)</i></span>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Description</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea id="applications-edit-description" rows="4" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Instructions</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <textarea id="applications-edit-instructions" rows="4" class="text"></textarea>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">R<?php echo htmlentities("&"); ?>D Point Person</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <select id="applications-edit-pointperson" class="select">
                        </select>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Production Date</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="applications-edit-production" type="text" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="field field-input-name">
                    <div class="field-secondary"><span class="label">Termination Date</span></div>
                    <div class="field-primary">
                        <div class="pseudo-field">
                        <input id="applications-edit-termination" type="text" class="text"></input>
                        </div>
                    </div><!-- End Field Primary -->
                </div><!-- End Field -->
                <div class="dialog-footer-block">
                    <div class="field field-text">
                        <div class="field-action-content">
                            <div class="pseudo-field pseudo-button">
                                <a id="applications-edit-cancel-button" class="cancel" href="#">Cancel</a>
                            </div>
                            <div class="pseudo-field pseudo-button primary-button">
                                <button id="applications-edit-save-button">Save Changes</button>
                            </div>
                        </div><!-- End Field Action Content -->
                    </div><!-- End Field Action -->
                </div><!-- End UI Dialog Footer Block -->
            </div>
        </div>
    </form>
</div><!--END edit applications-->