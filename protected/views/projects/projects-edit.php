                        <!-- edit part view -->
                        <div id="edit-projects-view" style="display:none;" class="contact-info plain-list">
                            <!-- FORM HERE -->
                            <form>
                                <input type="hidden" id="edit-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
                                <div class="contact-info-details">
                                    <div class="section primary-info expanded">
                                        <div id="expand-primary" class="header"><h3><b>Project Details</b></h3></div>
                                    </div>
                                    <!--CONTENT for EDIT PROJECT-->
                                    <div id="edit-primary-content" class="content">
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Name</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <input type="text" id="edit-name" class="text"></input>
                                                <span id="edit-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Code</span><span>(required)</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <input type="text" id="edit-code" class="text"></input>
                                                <span id="edit-code-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Description</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <textarea rows="4" id="edit-description" class="text"></textarea>
                                                <span id="edit-description-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Production Date</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <input type="date" id="edit-production" class="text"></input>
                                                <span id="edit-production-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="dialog-footer-block">
                                            <div class="field field-text">
                                                <div class="field-action-content">
                                                    <div class="pseudo-field pseudo-button">
                                                        <a id="edit-button-cancel" class="cancel" href="#">Cancel</a>
                                                    </div>
                                                    <div class="pseudo-field pseudo-button primary-button">
                                                        <button id="edit-button-update-project">Save Changes</button>
                                                    </div>
                                                </div><!-- End Field Action Content -->
                                            </div><!-- End Field Action -->
                                        </div><!-- End UI Dialog Footer Block -->
                                    </div>
                                    <!--END EDIT CONTENT PROJECT-->
                                </div>
                            </form>
                        </div><!--END edit user-->