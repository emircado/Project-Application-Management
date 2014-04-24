<?php
// Items for dropdownlists
    $status = ZHtml::enumItem(Projects::model(), 'status');

    // Add default blank value for search fields.
    $search_status = array(''=>'') + $status;
?>
<div class="primary">
    <div class="primary-container">
        <div class="primary-content">
            <div id="table" class="module-table module brand-names-table">
                <div class="header-block">
                    <div class="header-block-content">
                        <div class="header-block-title">
                            <h2 class="content-title">Projects</h2><br><hr>
                        </div>
                        <div id="projects-lists" class="table-main">
                            <?php echo CHtml::form('', 'post', array('id'=>'export-form', 'enctype'=>'multipart/form-data')); ?>
                            <fieldset>
                                <div class="table-header-block">
                                    <div class="header-block-button">
                                        <a id="create-project" class="button round blue image-right ic-add text-upper" href="#">Create Project</a>
                                    </div><!-- End Header Block Button -->

                                    <div class="header-block-side">
                                        <div class="page-nav">
                                            <div class="page-count">
                                                <span class="current-page" id="total-main-part"></span>
                                                <span class="all-page" id="total-main-data"></span>
                                            </div>
                                            <div class="page-nav-arrow">
                                                <a id="prev-main-button" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                                                <a id="next-main-button" class="next" href="#" title="Next"><span class="icon"></span></a>
                                            </div>
                                        </div>
                                    </div><!-- End Header Block Side -->
                                </div><!-- End Table Header Block -->
                                
                                <div id="content-div">
                                    <table>
                                        <thead>
                                            <tr>                      
                                                <th width='150'>Name</th>
                                                <th width='90'>Code</th>
                                                <th width=''>Description</th>
                                                <th width='115'>Status</th>
                                                <th width='120'>Production Date</th>
                                                <th width=''>Actions</th>
                                            </tr>
                                            <tr>
                                                <th><input id="search-name" type="text" style="width:130px"/></th>
                                                <th><input id="search-code" type="text" style="width:70px"/></th>
                                                <th>&nbsp;</th>
                                                <th>
                                                    <select class="select" name="search-status" id="search-status" style="width:115px;">
                                                        <?php
                                                            foreach($search_status as $key => $value)
                                                            {
                                                                ?>
                                                                <option value="<?= $key ?>"><?= $value ?></option>
                                                                <?php
                                                            }
                                                        ?>
                                                    </select>
                                                </th>
                                                <th>&nbsp;</th>
                                                <th><div><button id="search-submit">Search</button></div><a href="#" id="clear-search">Clear</a></th>
                                            </tr>
                                        </thead>
                                        <tbody id="data-result"></tbody>
                                    </table>
                                </div>
                                
                            </fieldset>
                            </form> <!--this is for the CHtml form-->
                            <div class="loader-container" id="loader">
                                <span class="loader"></span>
                                <div class="loader-modal"></div>
                            </div><!-- End Table main -->
                        </div><!--END View User List-->
                        
                        <!-- edit part view -->
                        <div id="edit-projects-view" style="display:none;" class="contact-info plain-list">
                            <!-- FORM HERE -->
                            <form>
                                <div class="contact-info-details">
                                    <div class="section primary-info expanded">
                                        <div id="expand-primary" class="header"><h3><b>Project Details</b></h3></div>
                                    </div>
                                    <!--CONTENT for EDIT USER-->
                                    <div id="edit-primary-content" class="content">
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Name</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <input type="text" id="edit-name" class="text"></input>
                                                <span id="input-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Code</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <input type="text" id="edit-code" class="text"></input>
                                                <span id="input-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Description</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <textarea rows="4" id="edit-description" class="text"></textarea>
                                                <span id="input-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div id="status-div" class="field field-status">
                                            <div class="field-secondary"><span class="label">Status</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field pseudo-field-select" style="width: 100px;">
                                                    <?php echo ZHtml::enumDropDownList(Projects::model(), 'status', array(
                                                        'id'=>'edit-status',
                                                        'name'=>'edit-status',
                                                        'class' => 'select'
                                                    )); ?>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Production Date</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <input type="date" id="edit-production" class="text"></input>
                                                <span id="input-name-error" class="field-input-name-error error-message" style="display: none;"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Termination Date</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field">
                                                <input type="date" id="edit-termination" class="text"></input>
                                                <span id="input-name-error" class="field-input-name-error error-message" style="display: none;"></span>
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
                                                        <button id="edit-button-create-project">Save</button>
                                                    </div>
                                                </div><!-- End Field Action Content -->
                                            </div><!-- End Field Action -->
                                        </div><!-- End UI Dialog Footer Block -->
                                    </div>
                                    <!--END EDIT CONTENT USER-->
                                </div>
                            </form>
                        </div><!--END edit user-->

                        <!-- view part view -->
                        <div id="view-projects-view" style="display:none;" class="contact-info plain-list">
                            <div class="header-block-button">
                                <div class="pseudo-field back-button">
                                    <a id="view-to-main" href="#" title="Back to main" class="with-tool-tip"><span class="icon"></span><span class="tooltip">Back<span class="arrow icon"></span></span></a>
                                </div>
                            </div><br /><br />

                            <!-- CONTENT HERE -->
                            <form>
                                <div class="contact-info-details">
                                    <div class="section primary-info expanded">
                                        <div id="expand-primary" class="header"><h3><b>Project Details</b></h3>&nbsp&nbsp<span id="view-content"></span></div>
                                    </div>
                                    <!-- <div id="view-content"></div> -->
                                    <div id="edit-primary-content" class="content">
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Name</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field no-border">
                                                    <span class="value" id="view-name"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Code</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field no-border">
                                                    <span class="value" id="view-code"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field --> 
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Description</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field no-border">
                                                    <span class="value" id="view-description"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field --> 
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Status</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field no-border">
                                                    <span class="value" id="view-status"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field --> 
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Production Date</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field no-border">
                                                    <span class="value" id="view-production"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field --> 
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Termination Date</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field no-border">
                                                    <span class="value" id="view-termination"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field --> 
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Date Created</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field no-border">
                                                    <span class="value" id="view-created"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field -->
                                        <div class="field field-input-name">
                                            <div class="field-secondary"><span class="label">Date Updated</span></div>
                                            <div class="field-primary">
                                                <div class="pseudo-field no-border">
                                                    <span class="value" id="view-updated"></span>
                                                </div>
                                            </div><!-- End Field Primary -->
                                        </div><!-- End Field --> 
                                    </div>
                                </div>
                            </form>
                        </div><!--END view user-->

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>